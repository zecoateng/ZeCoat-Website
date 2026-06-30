import { useState } from 'react';

export default function thingy({product}) {
    const [configuration, setConfiguration] = useState({});

    return (

        <div>{product.name}</div>
    )
}
