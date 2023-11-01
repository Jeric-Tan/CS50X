-- Keep a log of any SQL queries you execute as you solve the mystery.

-- Get the report from the Crime Scene --> Theft occured at 10:15AM with 3 WITNESS
SELECT * FROM crime_scene_reports WHERE year = 2021 AND month = 7 AND street = "Humphrey Street";

-- View WITNESS transcript --> 1. Within 10 min of theft he got into car - Check CCTV bakery parking lot
                           --> 2. Withdrawing money from ATM on Leggett Street earlier this MORNING
                           --> 3. Call less than a min
                           --> 4. Planning to take EARLIEST flight out of fiftyville TMR. OTHER person buy ticket
SELECT * FROM interviews WHERE year = 2021 AND month = 7 AND day = 28;

-- 1. Get LISCENCE PLATES from bakery security logs --
SELECT license_plate FROM bakery_security_logs WHERE year = 2021 AND month = 7 AND day = 28 AND hour = 10 AND minute >= 15 AND minute <= 25;

-- 2. ATM account_numbers --
SELECT * FROM atm_transactions WHERE year = 2021 AND month = 7 AND day = 28 AND atm_location = "Leggett Street";

    -- 2.5 person_id FOUND
    SELECT person_id FROM bank_accounts WHERE account_number in (SELECT account_number FROM atm_transactions WHERE year = 2021 AND month = 7 AND day = 28 AND atm_location = "Leggett Street");

-- 3. Phone numbers
SELECT caller, receiver FROM phone_calls WHERE year = 2021 AND month = 7 AND day = 28 AND duration < 60;

-- 4. Found the destination airport id
SELECT destination_airport_id FROM flights WHERE year = 2021 AND month = 7 AND day = 29 ORDER BY hour ASC ,minute ASC LIMIT 1;

    -- 4.5 FOUND airport full_name and CITY (TO NEW YORK CITY)
    SELECT city FROM airports WHERE id = (SELECT destination_airport_id FROM flights
                                       WHERE year = 2021 AND month = 7 AND day = 29 ORDER BY hour ASC, minute ASC LIMIT 1);

-- CULPRIT --
SELECT name FROM people
WHERE license_plate in (SELECT license_plate FROM bakery_security_logs WHERE year = 2021 AND month = 7 AND day = 28 AND hour = 10 AND minute >= 15 AND minute <= 25)
AND (phone_number in (SELECT caller FROM phone_calls WHERE year = 2021 AND month = 7 AND day = 28 AND duration < 60)
OR phone_number in (SELECT receiver FROM phone_calls WHERE year = 2021 AND month = 7 AND day = 28 AND duration < 60))
AND people.id in (SELECT person_id FROM bank_accounts WHERE account_number in (SELECT account_number FROM atm_transactions WHERE year = 2021 AND month = 7 AND day = 28 AND atm_location = "Leggett Street"))
AND passport_number in (SELECT passport_number FROM passengers WHERE flight_id = (SELECT id FROM flights WHERE year = 2021 AND month = 7 AND day = 29 ORDER BY hour ASC, minute ASC LIMIT 1));
-- Bruce --


-- ACCOMPLICE --
SELECT name FROM people
WHERE phone_number = (
SELECT receiver FROM phone_calls
WHERE caller = (SELECT phone_number FROM people WHERE name = "Bruce")
AND year = 2021 AND month = 7 AND day = 28 AND duration < 60
);
-- Robin --

