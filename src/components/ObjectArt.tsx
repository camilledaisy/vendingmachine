import { artMarkup } from '../art/art'
import { byId } from '../data/items'

// Draws an item: its photo if it has one (see `image` in data/items.ts), otherwise its SVG drawing.
export function ObjectArt({ id, name, size = 64, className = '' }: { id: string; name?: string; size?: number; className?: string }) {
  const image = byId(id)?.image
  if (image)
    return (
      <img
        src={image}
        alt={name ?? ''}
        width={size}
        height={size}
        className={`rounded-md border-2 border-charcoal bg-cream object-cover shadow-sm ${className}`}
        style={{ width: size, height: size }}
        draggable={false}
      />
    )
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
