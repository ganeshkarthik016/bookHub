const conf = {
    apiURL : String(import.meta.env.VITE_API_URL),
    socketIOURL : String(import.meta.env.VITE_SOCKET_IO_URL),
    tinymceApiKey : String(import.meta.env.VITE_TINYMCE_API_KEY),
}

export default conf;