import csv
import sys


def main():

    # TODO: Check for command-line usage
    if len(sys.argv) != 3:
        sys.exit("Usage: python dna.py data.csv sequence.txt")

    # TODO: Read database file into a variable
    database = []
    with open(sys.argv[1]) as data_file:
        reader = csv.DictReader(data_file)
        for row in reader:
            database.append(row)

    # TODO: Read DNA sequence file into a variable
    f = open(sys.argv[2], "r")
    seq = f.read()

    # TODO: Find longest match of each STR in DNA sequence

    keys = list(database[0].keys())
    suspect = {}
    for key in keys:
        suspect[key] = 0

    for i in range(1,len(keys)):
        longest = longest_match(seq, keys[i])
        suspect[keys[i]] = longest

    # TODO: Check database for matching profiles

    for i in range(0,len(database)):

        matches = 0

        for j in range(1,len(keys)):
            key = keys[j]
            if int(suspect[key]) == int(database[i][key]):
                matches += 1

        if matches == (len(keys) - 1):
            sys.exit(database[i]["name"])
    else:
        sys.exit("No Match")

def longest_match(sequence, subsequence):
    """Returns length of longest run of subsequence in sequence."""

    # Initialize variables
    longest_run = 0
    subsequence_length = len(subsequence)
    sequence_length = len(sequence)

    # Check each character in sequence for most consecutive runs of subsequence
    for i in range(sequence_length):

        # Initialize count of consecutive runs
        count = 0

        # Check for a subsequence match in a "substring" (a subset of characters) within sequence
        # If a match, move substring to next potential match in sequence
        # Continue moving substring and checking for matches until out of consecutive matches
        while True:

            # Adjust substring start and end
            start = i + count * subsequence_length
            end = start + subsequence_length

            # If there is a match in the substring
            if sequence[start:end] == subsequence:
                count += 1

            # If there is no match in the substring
            else:
                break

        # Update most consecutive matches found
        longest_run = max(longest_run, count)

    # After checking for runs at each character in seqeuence, return longest run found
    return longest_run


main()
