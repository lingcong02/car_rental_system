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