# TODO
from cs50 import get_int

def main():
    height = get_int("Height: ")
    while height < 1 or height > 8:
        height = get_int("Height: ")

    space = " "
    hash = "#"
    for i in range(1,height+1):
        print(f"{(height - i) * space}{i * hash}{2 * space}{i * hash}")

main()
