package internal/metrics

type TestResult struct {
	Framework string  `json:"framework"`
	Browser   string  `json:"browser"`
	TestName  string  `json:"test_name"`
	Status    string  `json:"status"`
	ErrorMsg  string  `json:"error"`
	Duration  float64 `json:"duration_ms"`
}