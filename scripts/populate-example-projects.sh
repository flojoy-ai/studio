#!/bin/bash

# Parse command-line arguments for docs directory and output file
while (( "$#" )); do
  case "$1" in
    --docsDirectory)
      docsDirectory=$2
      shift 2
      ;;
    --outputFile)
      outputFile=$2
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if docsDirectory and outputFile are provided
if [ -z "$docsDirectory" ] || [ -z "$outputFile" ]; then
    echo "Both --docsDirectory and --outputFile arguments are required"
    exit 1
fi

# Initialize the output file
echo "export const ExampleProjects = {" > $outputFile

# Find all app.json files in the docs directory and its subdirectories
find $docsDirectory -name "app.json" | while read -r file; do
    # Check if the file is empty
    if [ -s "$file" ]; then
        # Extract the folder path
        folder_path=$(dirname "$file")

        # Remove the first two directories from the path
        folder_name=$(echo $folder_path | cut -d'/' -f4-)

        # Add the folder name to the output file
        echo "    \"$folder_name\": " >> $outputFile

        # Add the contents of the app.json file to the output file
        cat "$file" >> $outputFile

        # Add a comma to separate entries
        echo "," >> $outputFile
    fi
done

# Close the export statement in the output file
echo "}" >> $outputFile