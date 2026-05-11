package api

import (
	"net/http"
	"engine-showdown/internal/DTO-Test-Result"
)

func server() {
	router := http.NewServeMux()

	router.HandleFunc("/metrics", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	server := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	server.ListenAndServe()
}