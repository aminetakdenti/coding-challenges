package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"strings"
)

func main() {
	var content string
	var file *os.File
	var err error

	cFlag := flag.Bool("c", false, "for counting number of bytes")
	lFlag := flag.Bool("l", false, "for counting number of lines")
	mFlag := flag.Bool("m", false, "for counting number of characters")

	flag.Parse()

	if len(os.Args) > 2 {
		// Check if the file path is provided as the second argument
		file, err = os.Open(os.Args[2])
		if err != nil {
			panic(err)
		}
	} else if len(os.Args) > 1 {
		// Check if the file path is provided as the first argument
		file, err = os.Open(os.Args[1])
		if err != nil {
			panic(err)
		}
	} else {
		// If no file path is provided, check if data is being piped in
		stat, _ := os.Stdin.Stat()
		if (stat.Mode() & os.ModeCharDevice) == 0 {
			file = os.Stdin
		} else {
			panic("You should pass a file path or pipe data")
		}
	}

	defer func() {
		if file != os.Stdin {
			file.Close()
		}
	}()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		content += scanner.Text() + "\n"
	}

	if *cFlag {
		fmt.Println(len([]byte(content)))
	}

	if *lFlag {
		fmt.Println(len(strings.Split(content, "\n")) - 1)
	}

	if *mFlag {
		fmt.Println(len(strings.Split(content, "")) - 1)
	}

	if !(*cFlag || *lFlag || *mFlag) {
		fmt.Printf(
			"%d %d %d %s\n",
			len([]byte(content)),
			len(strings.Split(content, "\n"))-1,
			len(strings.Split(content, ""))-1,
			file.Name(),
		)
	}
}
