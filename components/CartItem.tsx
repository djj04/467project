type CartItemProps = {
    number: number;
    quantity: number;
    part: { description: string; price: number}[];
}

export default function CartItem({ number, quantity, part }: CartItemProps) {

    return (
        <>
            <td>{number}</td>
            <td>{part[0]?.description}</td>
            <td>{quantity}</td>
            <td>${((part[0]?.price || 0) * (quantity || 0)).toFixed(2)}</td>
        </>
    )
}