package main
import (
	"fmt"
	"time"
)
func main() {
	fmt.Println("Starting Task Scheduler...")
	for {
		fmt.Printf("[%s] Running cron jobs...
", time.Now().Format(time.RFC3339))
		time.Sleep(5 * time.Second)
	}
}