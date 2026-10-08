import { artMarkup } from '../art/art'

export function ObjectArt({ id, name, size = 64, className = '' }: { id: string; name?: string; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role={name ? 'img' : undefined}
      aria-label={name}
      aria-hidden={name ? undefined : true}
      dangerouslySetInnerHTML={{ __html: artMarkup(id) }}
    />
  )
}
