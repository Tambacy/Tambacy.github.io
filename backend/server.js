const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { auth, JWT_SECRET } = require('./auth');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

function generateToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: '邮箱和密码不能为空' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: '邮箱格式不正确' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: '密码长度不能少于6位' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ success: false, error: '该邮箱已被注册' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const nickname = email.split('@')[0];

    const result = db.prepare('INSERT INTO users (email, password, nickname) VALUES (?, ?, ?)').run(email, hashedPassword, nickname);

    const user = {
      id: result.lastInsertRowid,
      email: email,
      nickname: nickname
    };

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      data: {
        token: token,
        user: user
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: '邮箱和密码不能为空' });
    }

    const user = db.prepare('SELECT id, email, password, nickname FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(400).json({ success: false, error: '邮箱或密码错误' });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(400).json({ success: false, error: '邮箱或密码错误' });
    }

    const tokenPayload = { id: user.id, email: user.email };
    const token = generateToken(tokenPayload);

    return res.json({
      success: true,
      data: {
        token: token,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, nickname FROM users WHERE id = ?').get(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        nickname: user.nickname
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.post('/api/comments', auth, (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: '评论内容不能为空' });
    }

    if (content.length > 500) {
      return res.status(400).json({ success: false, error: '评论内容不能超过500字' });
    }

    const result = db.prepare('INSERT INTO comments (user_id, content) VALUES (?, ?)').run(req.userId, content.trim());

    return res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        content: content.trim(),
        userId: req.userId
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.get('/api/comments', (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, parseInt(req.query.pageSize) || 20);
    const offset = (page - 1) * pageSize;

    const totalRow = db.prepare('SELECT COUNT(*) as total FROM comments').get();
    const total = totalRow.total;

    const comments = db.prepare(`
      SELECT c.id, c.content, c.created_at, u.nickname, c.user_id
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(pageSize, offset);

    return res.json({
      success: true,
      data: {
        comments: comments,
        total: total,
        page: page,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.delete('/api/comments/:id', auth, (req, res) => {
  try {
    const commentId = parseInt(req.params.id);

    const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: '评论不存在' });
    }

    if (comment.user_id !== req.userId) {
      return res.status(403).json({ success: false, error: '无权删除此评论' });
    }

    db.prepare('DELETE FROM comments WHERE id = ?').run(commentId);

    return res.json({ success: true, data: null });
  } catch (err) {
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.post('/api/diagnostic', auth, (req, res) => {
  try {
    const { typeCode, typeName, scores } = req.body;

    if (!typeCode || !typeName || !scores) {
      return res.status(400).json({ success: false, error: '缺少必要参数' });
    }

    if (!Array.isArray(scores) || scores.length !== 6) {
      return res.status(400).json({ success: false, error: 'scores 必须是包含6个数字的数组' });
    }

    const allNumbers = scores.every(s => typeof s === 'number');
    if (!allNumbers) {
      return res.status(400).json({ success: false, error: 'scores 中的每个元素必须是数字' });
    }

    const scoresStr = JSON.stringify(scores);

    const result = db.prepare('INSERT INTO diagnostic_results (user_id, type_code, type_name, scores) VALUES (?, ?, ?, ?)').run(req.userId, typeCode, typeName, scoresStr);

    return res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        typeCode: typeCode,
        typeName: typeName,
        scores: scores
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.get('/api/diagnostic/history', auth, (req, res) => {
  try {
    const results = db.prepare(`
      SELECT id, user_id, type_code, type_name, scores, created_at
      FROM diagnostic_results
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.userId);

    const data = results.map(r => ({
      id: r.id,
      userId: r.user_id,
      typeCode: r.type_code,
      typeName: r.type_name,
      scores: JSON.parse(r.scores),
      createdAt: r.created_at
    }));

    return res.json({
      success: true,
      data: data
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: '服务器内部错误' });
  }
});

app.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
});