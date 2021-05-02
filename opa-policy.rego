package rules

default main = {"allowed": false, "http_status": 301}

main = {"allowed": allow, "http_status": 301}

default allow = false

allow {
    input.user = "kurt"
}