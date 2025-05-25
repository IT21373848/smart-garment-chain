export const createOrderNumber = (designId: string): string => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER-${timestamp}-${designId}`
}

export const convertToTimeRemaining = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} days ${remainingHours.toFixed(0)} hours`;
};