import Image from 'next/image'
import { HTMLAttributes, forwardRef } from 'react'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className = '', src, alt = 'Avatar', size = 'md', fallback, ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-14 h-14 text-base',
      xl: 'w-20 h-20 text-lg',
    }

    const imageSizes = {
      sm: 32,
      md: 40,
      lg: 56,
      xl: 80,
    }

    // Generate initials from fallback text
    const initials = fallback
      ?.split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?'

    return (
      <div
        ref={ref}
        className={`
          ${sizes[size]}
          relative rounded-full overflow-hidden
          bg-indigo-100 dark:bg-indigo-900
          flex items-center justify-center
          font-medium text-indigo-600 dark:text-indigo-300
          ${className}
        `}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            width={imageSizes[size]}
            height={imageSizes[size]}
            className="object-cover w-full h-full"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
