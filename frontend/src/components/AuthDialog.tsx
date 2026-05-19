import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function AuthDialog() {
  const {
    isAuthDialogOpen,
    authDialogMode,
    closeAuthDialog,
    openAuthDialog,
    login,
    register,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isLogin = authDialogMode === 'login'

  function resetForm() {
    setEmail('')
    setPassword('')
    setEmailError('')
    setPasswordError('')
    setServerError('')
  }

  function validate(): boolean {
    let valid = true

    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('请输入有效的邮箱地址')
      valid = false
    } else {
      setEmailError('')
    }

    if (password.length < 6) {
      setPasswordError('密码至少需要6位字符')
      valid = false
    } else {
      setPasswordError('')
    }

    return valid
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')

    if (!validate()) return

    setIsSubmitting(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password)
      }
      resetForm()
      closeAuthDialog()
    } catch (err) {
      setServerError(err instanceof Error ? err.message : '操作失败，请重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      resetForm()
      closeAuthDialog()
    }
  }

  function switchMode() {
    resetForm()
    openAuthDialog(isLogin ? 'register' : 'login')
  }

  return (
    <Dialog open={isAuthDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isLogin ? '登录' : '注册'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              placeholder="邮箱"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (emailError) setEmailError('')
              }}
              disabled={isSubmitting}
            />
            {emailError && (
              <p className="text-sm text-red-500">{emailError}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (passwordError) setPasswordError('')
              }}
              disabled={isSubmitting}
            />
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
          </div>
          {serverError && (
            <p className="text-sm text-red-500">{serverError}</p>
          )}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting
              ? isLogin
                ? '登录中...'
                : '注册中...'
              : isLogin
                ? '登录'
                : '注册'}
          </Button>
        </form>
        <p className="text-center text-sm text-muted">
          {isLogin ? '没有账号？' : '已有账号？'}
          <button
            type="button"
            onClick={switchMode}
            disabled={isSubmitting}
            className="ml-1 text-accent hover:underline disabled:opacity-50"
          >
            {isLogin ? '去注册' : '去登录'}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}