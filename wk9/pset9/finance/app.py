import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
import datetime
from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    if request.method == "GET":
        #get a list of dicts where the stock info can be found
        rows = db.execute("SELECT stock, qty FROM display WHERE customer_id = ?", session['user_id'])
        stock_info = []
        valuation = 0
        for row in rows:
            stock = {}
            temp = lookup(row['stock'])
            valuation += (temp['price'] * row['qty'])
            stock['stock'] = row['stock']
            stock['amount'] = row['qty']
            stock['price'] = usd(temp['price'])
            stock['value'] = usd(temp['price'] * (row['qty']))
            stock_info.append(stock)

        #current balance
        if db.execute("SELECT cash FROM users WHERE id = ?", session["user_id"]):
            current_bal = round(db.execute("SELECT cash FROM users WHERE id = ?", session["user_id"])[0]['cash'], 2)

        #calculate the user's profile worth
            valuation += current_bal

            return render_template("index.html", stocks=stock_info, current_bal=usd(current_bal), eval=usd(valuation))

        else:
            return render_template("index.html")
    else:
        return redirect("/")

@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    if request.method == "POST":
        #get variables
        #check
        if not request.form.get("symbol"):
            return apology("must provide valid stock", 400)
        if lookup(request.form.get("symbol")) == None:
            return apology("Symbol does not exist", 400)
        if not request.form.get("shares"):
            return apology("Must provide shares", 400)
        shares = request.form.get("shares")
        if not shares.isdecimal():
            return apology("Not a valid share", 400)
        if int(shares) < 1:
            return apology("Not a valid share amount", 400)

        #get price of stock
        stock = lookup(request.form.get("symbol"))
        name = stock['symbol']
        price = stock['price']
        cash_curr = db.execute("SELECT cash FROM users WHERE id=?",session['user_id'])[0]['cash']
        cash_after = cash_curr - (int(shares) * price)

        #checking for sufficient funds
        if cash_after < 0:
            return apology("insufficient funds")

        #update BUY
        db.execute("INSERT INTO purchase (customer_id, time, stock, qty, price) VALUES (?,?,?,?,?)", session["user_id"], datetime.datetime.now(), name, shares, price)

        #update cash
        db.execute("UPDATE users SET cash = ? WHERE id = ?", cash_after, session["user_id"])

        #update number of shares in DISPLAY
        #get list of stocks in DISAPLY
        stocks = []
        rows = db.execute("SELECT stock FROM display WHERE customer_id = ? GROUP BY stock", session['user_id'])
        for row in rows:
            stocks.append(row['stock'])

        #if the stock is in the list of stocks, calculate the number of shares after purchase and UPDATE DISPLAY
        if stock in stocks:
            shares_curr = db.execute("SELECT qty FROM display WHERE stock = ? AND customer_id = ?", stock, session['user_id'])[0]['qty']
            shares_after = shares_curr + shares
            db.execute("UPDATE display SET qty = ? WHERE stock = ? AND customer_id = ?", shares_after, stock, session['user_id'])

        #else INSERT INTO a new stock entry
        else:
            db.execute("INSERT INTO display (customer_id, stock, qty) VALUES (?,?,?)", session['user_id'], name, shares)

        flash('bought!')
        return redirect("/")
    else:
        return render_template("buy.html")

@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    if request.method == "GET":
        rows = db.execute("SELECT time, transaction_type, stock, qty, price FROM ( SELECT customer_id, time, 'purchase' AS transaction_type, stock, qty, price FROM purchase UNION ALL SELECT customer_id, time, 'sell' AS transaction_type, stock, qty, price FROM sell) WHERE customer_id = ? ORDER BY time DESC", session['user_id'])
        return render_template("history.html", rows=rows)


    return apology("TODO")


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute("SELECT * FROM users WHERE username = ?", request.form.get("username"))

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["hash"], request.form.get("password")):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""
    if request.method == "POST":

        _symbol = request.form.get('symbol')
        if not _symbol:
            return apology("must provide a stock", 400)
        if (lookup(_symbol)) == None:
            return apology("not a valid stock", 400)


        symbolDict = lookup(_symbol)
        name = symbolDict['name']
        price = symbolDict['price']
        return render_template("quoted.html", name=name, price=usd(price))

    else:
        return render_template("quote.html")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "POST":
        if request.form.get('username') and request.form.get('password') and request.form.get('confirmation'):
            _username = request.form.get('username')
            _password = request.form.get('password')
            _confirmation = request.form.get('confirmation')
        else:
            return apology("empty fields", 400)

        if _password == _confirmation:
            _hash = generate_password_hash(_password)
            try:
                db.execute("INSERT INTO users (username, hash) VALUES (?,?)", _username, _hash)
            except ValueError:
                return apology("username not unique")
            return redirect("/")
        else:
            return apology("Passwords do not match, 403")

    else:
        return render_template("register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
        #get each type of stock from PURCHASE
    rows = db.execute("SELECT stock FROM display WHERE customer_id = ? GROUP BY stock", session["user_id"])
    stocks = []
    for stock in rows:
        stocks.append(stock['stock'])

    if request.method == "POST":
        #get variables from sell.html
        symbol = request.form.get("symbol")
        if not request.form.get("shares"):
            return apology("enter an amount")
        no_shares = int(request.form.get("shares"))

        #check the validity of variables
        if not symbol or lookup(symbol) == None:
            return apology("must provide valid stock", 400)
        if symbol not in stocks:
            return apology("do not own that stock", 400)
        total_shares = int(db.execute("SELECT qty FROM display WHERE stock = ?", symbol)[0]['qty'])
        if no_shares < 1:
            return apology("number of shares must be more than 1", 400)
        if total_shares < no_shares:
            return apology("do not have enough shares", 400)

        #update sell table in SELL
        current_price = int(lookup(symbol)['price'])
        db.execute("INSERT INTO sell (customer_id, time, stock, qty, price) VALUES (?, CURRENT_TIMESTAMP,?,?,?)", session["user_id"], symbol, no_shares, current_price)

        #update balance after selling in USERS
        value_of_sale = current_price * no_shares
        balance = int(db.execute("SELECT cash FROM users WHERE id = ?", session["user_id"])[0]['cash'])
        new_bal = balance + value_of_sale
        db.execute("UPDATE users SET cash = ? WHERE id = ?" , new_bal ,session["user_id"])

        #update number of shares in DISPLAY
        shares_after = total_shares - no_shares

        if shares_after == 0:
            db.execute("DELETE FROM display WHERE stock = ? AND customer_id = ?", symbol, session['user_id'])
        else:
            db.execute("UPDATE display SET qty = ? WHERE stock = ? AND customer_id = ?", shares_after, symbol, session['user_id'])

        return redirect("/")


    else:
        return render_template("sell.html", stocks=stocks)


@app.route("/add", methods=["GET", "POST"])
@login_required
def add():
    if request.method == "POST":
        ammount = int(request.form.get("ammount"))
        if not ammount:
            return apology("must provide an ammount", 400)
        if ammount < 0:
            return apology("must provide a valid ammount", 400)
        curr = db.execute("SELECT cash FROM users WHERE id=?", session["user_id"])[0]['cash']
        new_bal = ammount + curr
        db.execute("UPDATE users SET cash = ? WHERE id = ?" , new_bal ,session["user_id"])
        return redirect("/")
    else:
        return render_template("add.html")