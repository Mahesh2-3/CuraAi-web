export async function openPrivateFile(url: string, filename: string) {
    try {
        // Instead of downloading to a non-existent mobile filesystem,
        // we simply open the signed URL in a new browser tab.
        window.open(url, "_blank");
    } catch (err) {

    }
}
