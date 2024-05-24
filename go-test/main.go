package main

import (
	"fmt"
	"net/http"
	"strings"
)

func triggerReq(url string, ch chan<- string) {
	// Make the HTTP GET request
	resp, err := http.Get(url)
	if err != nil {
		ch <- "Failed to make request " + url + ":" + err.Error()
		return
	}
	// Ensure the response body is closed after reading the status
	defer resp.Body.Close()
	if resp.StatusCode != 200 {
		ch <- "Failed to make request " + url + ":" + resp.Status
		return
	}
	ch <- "Success from " + url + ":" + resp.Status
}

func main() {
	urls := []string{
		"https://admin.idralliance.global/sites/default/files/2024-04/UY.svg?changed=1715767961000",
		"https://admin.idralliance.global/sites/default/files/2024-04/CL.svg?changed=1715767961000&w=256&q=75",
	}
	numGoroutines := 30 * len(urls)
	ch := make(chan string, numGoroutines)
	// List of URLs to request

	// Iterate over the list of URLs and make a request to each
	for i := 0; i < numGoroutines; i++ {
		for _, url := range urls {
			go triggerReq(url, ch)
		}
	}

	// Receive messages from the goroutines
	for i := 1; i <= numGoroutines; i++ {
		message := <-ch
		if strings.HasPrefix(message, "Failed") {
			fmt.Println(message)
		}
	}

	fmt.Println("All goroutines have finished")
}
