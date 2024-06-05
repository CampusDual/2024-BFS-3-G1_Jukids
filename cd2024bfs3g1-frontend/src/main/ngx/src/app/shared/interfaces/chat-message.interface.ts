// {
//     "fromUser": "sender",
//     "toUser": "target",
//     "message": "MENSAJE"
// }


export interface ChatMessageResponseInterface {
    customerName: string;
    sellerName: string;
    ownerMsg: string;
    message: string;
    insertedDate: string;
}

export interface ChatMessageModelInterface {
    customerId: string;
    toyId: string;
    message: string;
}