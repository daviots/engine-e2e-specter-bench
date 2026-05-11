package main

import (
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"time"
)

const targetURL = "http://localhost:3000"


func main() {

	fmt.Println("Starting Engine-E2E-Specter-Bench...")

	fmt.Println("Spinning up Juice Shop via Docker...")
	cmd := exec.Command("docker-compose", "up", "-d")
	if err := cmd.Run(); err != nil {
		fmt.Printf("Failed to start Docker: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Waiting for target to be ready...")
	if waitForTarget(targetURL) {
		fmt.Println("Target iss up, Starting Bench")
	} else {
		fmt.Println("Target failed to respond. Shutting Down...")
		os.Exit(1)
	}
}


func waitForTarget(url string) bool {
	timeout := time.After(30 * time.Second)
	tick := time.Tick(2 * time.Second)

	for {
		select {
		case <-timeout:
			return false
		case <-tick:
			resp, err := http.Get(url)
			if err == nil && resp.StatusCode == 200 {
				return true
			}
			fmt.Print(".")
		}
	}
	
}