---
layout: post
title: "Error JSON Format"
---

At Venmo we've been rethinking our error JSON format, and have had a bunch of different suggestions. Would love to crowdsource this and get some suggestions/opinions. ([gist here](https://gist.github.com/ronshapiro/11059002))

Option 1: Flat

    {
        message: "There was an error.", //top level, localized
        errors: [
            {
                hierarchy: ["card", "address"], // list of categories; hierarchy.length > 0
                code: 456,
                message: "Your billing address is invalid."
            },
            {
                hierarchy: ["card", "expiration"],
                code: 789,
                message: "Your card has expired."
            },
            {
                hierarchy: ["amount"]
                code: 123
                message: "Negative amounts are not valid, please pay someone positive moneyz."
            }
        ]
    }

Option 2: Hierarchical

    {
        message: "There was an error.", //top level
        fieldErrors: [
            {
                field:  "card",
                fieldErrors: [
                    {
                        // this is the base error type, but can be nested to arbitrary depths
                        field: "address",
                        code: 456,
                        message: "Your billing address is invalid."
                    },
                    {
                        field: "expiration",
                        code: 789,
                        message: "Your card has expired."
                    }
                ]
            },
            {
                // same base error, but not nested as deep
                field:  "amount",
                code: 123,
                message: "Negative amounts are not valid, please pay someone positive moneyz."
            }
        ]
    }
