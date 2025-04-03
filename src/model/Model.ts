export type VehicleModel = {
    id: number;
    name: string;
    model: number;
    platNo: string;
    desc: string;
    price: number;
    image: ImageModel[];
}

type ImageModel = {
    path: string;
}

export type VehicleModelModel = {
    id: number;
    desc: string;
}

export type UserModel = {
    name: string;
    password: string;
    email: string;
    phone: string;
}

export type BookingModel = {
    bookingNo: string;
    vehicleId: number;
    userId: number;
    custName: string;
    custEmail: string;
    custPhone: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
}

export type BookingRequestModel = {
    bookingNo: string;
    custName: string;
    custEmail: string;
    custPhone: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    user: UserModel;
    vehicle: VehicleModel;
}