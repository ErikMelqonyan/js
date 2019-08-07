"use strict";


let  indicator = false;


function postfix(s)
{
    indicator = false;
    let res = f(s);
    if(!res)
    {
        indicator = true;
        return "Error!!! Invalid input!";
    }
    s = correct(s);
    let opstk = [];
    let c = "",u = "";
    let x = "",cc = "";
    let i = 0;
    while (s.length != i)
    {

        if (s[i] < '0' || s[i] > '9')
        {
            cc = s[i];
            ++i;
            if (cc == '(')
            {
                opstk.push(cc);
            }
            else if(cc != ')')
            {
                while (!opstk.length == 0 && opstk[opstk.length - 1] != '(')
                {
                    x = opstk[opstk.length - 1];
                    opstk.pop();
                    if (priority(x) >= priority(cc))
                    {
                        u += x;
                    }
                    else {
                        opstk.push(x);
                        break;
                    }
                }
                opstk.push(cc);
            }
            else if(cc == ')') {
                x = opstk[opstk.length - 1];
                opstk.pop();
                while (x != '(')
                {
                    u += x;
                    x = opstk[opstk.length - 1];
                    opstk.pop();
                }
            }
        }
        else
        {
            while (s[i] >= '0' && s[i] <= '9')
            {
                c += s[i];
                ++i;
            }
            c += ' ';
            u += c;
            c = "";
        }
    }
    while (!opstk.length == 0)
    {
        u += opstk[opstk.length - 1];
        opstk.pop();
    }
    return calculate(u);
}

function valid(c) {
    return (c >= '0' && c <= '9') ||
        c == '+' || c == '*' ||
        c == '-' || c == '/' ||
        c == '^' || c == '(' ||
        c == ')' || c == '%';

}

function f(s)
{
    let co = 0;
    for (let i = 0; i < s.length; ++i)
    {
        if(!valid(s[i]))
            return false;
        if (s[i] == '(')
            ++co;
        if (s[i] == ')')
            --co;
        if (co == -1)
            return false;
    }
    if (co != 0)
        return false;
    if ((s[s.length - 1] < '0' || s[s.length - 1] > '9') && s[s.length - 1] != '^' && s[s.length - 1] != ')')
        return false;
    if ((s[0] < '0' || s[0] > '9') && s[0] != '-' && (s[0] != '('))
        return false;
    let res = true;
    for (let i = 0; i < s.length - 1; ++i)
    {
        res = f_help(s[i], s[i + 1]);
        if (!res)
            return false;
    }
    if(s.length > 1)
        if(s[0] == '0' && s[1] >= '0' && s[1] <= '9')
            return false;
    for(let i = 1;i < s.length - 1; ++i)
    {
        if((s[i - 1] < '0' || s[i - 1] > '9') && s[i] == '0' && s[i + 1] >= '0' && s[i + 1] <= '9')
            return false;
    }
    return true;
}


function f_help(a, b)
{
    if ((a == '+' || a == '-' || a == '*' || a == '/' || a == '%' || a == '^')
        && (b == '+' || b == '-' || b == '*' || b == '/' || b == '%' || b == '^'))
        return false;
    if (a == ')' && (b == '(' || b >= '0' && b<= '9'))
        return false;
    if (a == '(' && b == ')')
        return false;
    if ((a == '/' || a == '%') && b == '0')
        return false;
    if (b == ')' && ((a < '0' || a > '9') && a != ')' && a != '^'))
        return false;
    if (a == '(' && (b < '0' || b >'9') && b != '-' && b != '(')
        return false;
    if(b == '(' && a >= '0' && a <= '9')
        return false;
    return true;
}


function correct(s)
{

    if (s[0] == '-')
    {
        s = "0" + s;
        s = "(" + s;
        s += ")";
    }
    for (let i = 1; i < s.length; ++i)
    {
        if (s[i] == '-' && s[i - 1] == '(')
        {
            if (s[i + 1] >= '0' && s[i + 1] <= '9')
            {
                s = s.slice(0,i) + "0" + s.slice(i + 1,s.length);
                s = s.slice(0,i) + "(" + s.slice(i + 1,s.length);
                i += 3;
                while (s[i] >= '0' && s[i] <= '9')
                {
                    ++i;
                }
                s = s.slice(0,i) + ")" + s.slice(i + 1,s.length);
            }
            else if(s[i+1] == '(')
            {
                let k = i + 3,co = 0;
                s = s.slice(0,i) + "0" + s.slice(i + 1,s.length);
                s = s.slice(0,i) + "(" + s.slice(i + 1,s.length);
                while (true)
                {
                    if (s[k] == '(')
                        ++co;
                    if (s[k] == ')')
                        --co;
                    ++k;
                    if (co == 0)
                    {
                        s = s.slice(0,k) + ")" + s.slice(k + 1,s.length);
                        ++i;
                        break;
                    }
                }
            }
        }
    }
    return s;
}


function priority(c)
{
    if (c == '+' || c == '-')
        return 0;
    if (c == '*' || c == '/' || c == '%')
        return 1;
    return 2;
}


function calculate(u)
{
    let stk = [];
    let x, y, z, k;
    let c = "";
    let s = "";
    let i = 0;
    while ((u.length) != i)
    {
        if (u[i] < '0' || u[i] > '9')
        {
            c = u[i];
            ++i;
            x = stk[stk.length - 1];
            stk.pop();
            y = stk[stk.length - 1];
            stk.pop();
            z = action(x, y, c);
            if(indicator && z == 0)
            {
                return 0;
            }
            stk.push(z);
        }
        else
        {
            while (u[i] >= '0' && u[i] <= '9')
            {
                s += u[i];
                ++i;
            }
            ++i;
            k = Number(s);
            stk.push(k);
            s = "";
        }
    }
    return stk[stk.length - 1];
}


function action(x, y, c)
{
    if (c == '+')
        return y + x;
    if (c == '-')
        return y - x;
    if (c == '*')
        return y * x;
    if (c == '/')
    {
        if(x == 0)
        {
            indicator = true;
            return 0;
        }
        return y / x;
    }
    if (c == '%')
    {
        if(y == 0)
        {
            indicator = true;
            return 0;
        }
        return y % x;
    }
    return Math.pow(y, x);
}

