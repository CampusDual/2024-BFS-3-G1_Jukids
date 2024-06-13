export interface ChatMessageResponseInterface {
    customerId: string,
    ownerId: string,
    toyId: string,
    msg: string,
    insertedDate: string,
    customerName: string,
    customerAvatar: string,
    price: string,
    toyName: string,
    sellerName: string,
    sellerAvatar: string
}

export interface ChatMessageModelInterface {
    customerId: string;
    toyId: string;
    message: string;
    owner: string;
}