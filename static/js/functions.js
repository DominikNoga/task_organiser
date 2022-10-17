export const fetchApi = async (url) =>{
    const api = await fetch(url);
    const apiJson = await api.json();
    return apiJson;
}
