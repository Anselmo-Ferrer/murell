'use client'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  const applyThemeChange = (newTheme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = storedTheme === 'dark' || (!storedTheme && systemPrefersDark) 
      ? 'dark' 
      : 'light'
      
    applyThemeChange(initialTheme);
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    
    // @ts-ignore:
    if (!document.startViewTransition) {
      applyThemeChange(newTheme)
      return
    }

    // @ts-ignore
    document.startViewTransition(() => {
      applyThemeChange(newTheme)
    })
  }

  if (!mounted) {
    return <div className="h-[30px] w-[30px]" />
  }

  return (
    <button
      onClick={toggleTheme}
      className="
        flex items-center justify-center
        cursor-pointer
        hover:bg-[#9595954D]
        h-[30px] w-[30px]
        rounded-full
        transition duration-150 ease-in-out
        text-[#0A0A0A] dark:text-white
      "
    >
      {theme === 'light' 
        ? <Sun size={18} className="text-[#0A0A0A] dark:text-[#fff]" /> 
        : <Moon size={18} className="text-[#0A0A0A] dark:text-[#fff]" />
      }
    </button>
  )
}