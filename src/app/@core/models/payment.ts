export interface Plan {
	id: number;
    name: string;
    features: string[];
    price: number;
    billing: string;
}

export interface Cart {
    plan: Plan;
    total: number;
    checkout: string;
}

export interface PayPlan {
	planId: number;
	groupId: number;
	typeId: number;
	description: string;
	tokens: number;
	costpertx: number;
	status: string;
}

export interface Order {
	orderId: number;
	userId: number;
	date: number;
	planId: number;
	paymentId: number;
	costpertx: number;
	price: number;
	quantity: number;
	total: number;
}

export interface PayLedger {
	ledgerId: number;
	actionId: number;
	sellerId: number;
	buyerId: number;
	orderId: number;
	tokenId: number;
	date: number;
	amount: number;
}