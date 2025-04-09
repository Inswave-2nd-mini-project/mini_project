export async function fetchAndInsert(url, containerId) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        document.getElementById(containerId).innerHTML = data;
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
    }
}