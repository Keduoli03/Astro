export function formatDateToYYYYMMDD(date: Date | undefined): string {
    if (!date) {
        return new Date().toISOString().substring(0, 10);
    }
    return date.toISOString().substring(0, 10);
}
