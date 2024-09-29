import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/config/payload-types'
import { ImageIcon, X } from 'lucide-react'
import { PRODUCT_CATEGORIES } from '@/config/webConfig'
import { useCart } from '@/hooks/useCart'

const CartItem = ({ product, count }: { product: Product; count?: number }) => {
    // @ts-ignore
    const { image } = product.images[0]
    const { removeItem } = useCart()
    const label = PRODUCT_CATEGORIES.find(
        ({ value }) => value === product?.category,
    )?.label

    return (
        <div className={'space-y-3 py-2'}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center space-x-4 flex-grow">
                    <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded-lg">
                        {typeof image !== 'string' && image.url ? (
                            <Image
                                src={image.url}
                                alt={product.name}
                                fill
                                className="absolute object-cover"
                            ></Image>
                        ) : (
                            <div className="flex h-full items-center justify-center bg-secondary">
                                <ImageIcon
                                    aria-hidden="true"
                                    className="h-4 w-4 text-muted-foreground"
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col flex-grow">
                        <span className="line-clamp-1 text-sm font-medium mb-1">
                            {product.name}
                        </span>
                        <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
                            {label}
                        </span>
                        <div className="flex flex-col space-y-1 font-medium">
                            <span className="mr-auto line-clamp-1 text-sm">
                                {formatPrice(product.price)}
                            </span>
                        </div>
                    </div>

                    <span className="ml-auto flex flex-col items-end self-end text-sm text-muted-foreground font-light">
                        {count != 1 ? <div className="mr-0">x{count}</div> : null}
                    </span>

                    <div className="auto"></div>
                </div>
                <button
                    onClick={() => {
                        removeItem(product.id)
                    }}
                    className="mt-4 text-xs text-muted-foreground"
                >
                    <X className="w-3 h-4" />
                </button>
            </div>
        </div>
    )
}

export default CartItem
