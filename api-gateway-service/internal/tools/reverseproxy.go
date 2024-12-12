package reverseproxy

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"time"
)

// createReverseProxy creates and returns a reverse proxy for a given backend URL
func CreateReverseProxy(target string, timeout time.Duration) *httputil.ReverseProxy {
	// Parse the target URL
	url, err := url.Parse(target)
	if err != nil {
		panic("Invalid backend URL: " + err.Error())
	}

	// Create an HTTP client with a timeout for the reverse proxy requests
	client := &http.Client{Timeout: timeout} // Set the timeout here for the proxy requests

	// Return a reverse proxy with the custom client
	proxy := httputil.NewSingleHostReverseProxy(url)
	proxy.Transport = client.Transport // Use the custom client transport

	return proxy
}
