# TODO

def main():
    card = int(input("Number: "))
    twos = str(card)[0] + str(card)[1]

    if checksum(card):

        if (len(str(card)) == 15 and (int(twos) == 34 or int(twos) == 37)):
            print("AMEX")

        #MC
        elif (len(str(card)) == 16 and int(twos) >= 51 and int(twos) <= 55):
            print("MASTERCARD")

        #VISA
        elif ((len(str(card)) == 13 or len(str(card)) == 16) and int(twos[0]) == 4):
            print("VISA")

        #Invalid
        else:
            print("INVALID")
    else:
        print("INVALID")

def checksum(card):
    sum = int(0)
    alternate = False
    while card > 1:
        last_no = int(card % 10)
        if alternate:
            if last_no >= 5:
                sum += ((last_no * 2) % 10 + 1)
            else:
                sum += last_no * 2
        else:
            sum += last_no
        card /= 10

        if alternate:
            alternate = False
        else:
            alternate = True


    if (sum % 10) == 0:
        return True
    else:
        return False

def card_type(card):
    twos = str(card)[0] + str(card)[1]

    if (len(str(card)) == 15 and (int(twos) == 34 or int(twos) == 37)):
        print("AMEX")

    #MC
    elif (len(str(card)) == 16 and int(twos) >= 51 and int(twos) <= 55):
        print("MASTERCARD")

    #VISA
    elif ((len(str(card)) == 13 or len(str(card)) == 16) and int(twos[0]) == 4):
        print("VISA")

    #Invalid
    else:
        print("INVALID")

    return None

if __name__ == "__main__":
    main()