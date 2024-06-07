// {
//     "fromUser": "sender",
//     "toUser": "target",
//     "message": "MENSAJE"
// }

/**
 *  private String customerId;
    private String ownerId;
    private String toyId;
    private String msg;
    private String insertedDate;
    private String customerName;
    private String customerAvatar;
    private String price;
    private String toyName;
    private String sellerName;
    private String sellerAvatar;
 * 
 * 
 */


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
}