---
title: "Logseq Tips: How I Organize My Books and Movies"
date: 2023-07-01T11:00:00+02:00
draft: false

series:
  - Logseq Tips

tags:
  - Logseq
  - Organization
  - Software

---

---

# Can you hear me?
No? I wonder why… Well, we might never get to why you don't, but, atleast, I know one thing. Logseq[^1] is a pretty good tool for what it’s made for.

Crazy, right?

If you don’t know what Logseq[^1] is, then you might want to learn more on their [website](https://logseq.com/) (which looks fantastic), or read this tl;dr: word documents combined with some clever programming for making a world of difference in your personal or professional organization.

Also, if you are not yet accustomed to how this tool works, and you’re expecting a full-fledged tutorial, then you’re gravely mistaken (I always wanted to write it down somewhere, sounds so cool). I recommend you to watch [this](https://www.youtube.com/watch?v=asEesjv0kTs) first and then go back here after grasping some basics.

---

I will no longer hold you hostage on this passage of boring text, let’s get into the thing you’re here for.

# Building blocks of the universe

Or you just can call them templates. I will do a quick run down of the ones I use to attach all the required metadata into appropriate pages.

```goat
Media
 ├─Books
 │  └─Meta
 └─Movies
    └─Meta
```

⇧ How I organized my blocks

I store my templates in the `Templates` page, but it should work everywhere as long as you mark the block as template. 

---

## Book/Movie template
```md
### Books/Movies
template:: Book/Movie Template
template-including-parent:: false
```

## Book Meta
```md
## Meta
type:: [[Book]]
title:: 
author:: 
status:: 
started-on:: 
completed-on:: 
```

## Movie Meta Template
```md
## Meta
type:: [[Movie]] 
title:: 
release-year:: 
director:: 
writer:: 
status:: 
started-on:: 
completed-on:: 
rating:: 
```

---

Aaaand that should be it. After adding everything into the Logseq, you should be able to call `/template` and select book and movie template. You can apply a similar pattern to other type of media or data overall.

{{< figure
    src="example.png"
    alt="As shown in logseq"
    caption="How To Win Friends And Influence People in my Logseq graph"
>}}

Now, it’s time to wrap this up into a good-looking table, so you can easily visualize how much you could’ve done if you started going through your ”””planned””” stuff.

# A sad reminder of your time left on this planet

I guess you already have a plan where to put the tables you are so eager to show off to yourself, so I will just give you a recipe and a few useful hacks.

`{{query (and (property type Book) (not [[Templates]]))}}`

This query, in which you can supplement `Book` for any `type::`, will generate you a list of all the pages/blocks, so in consequence, your books.

---

On the right side of the screen you’ll find and list/grid icon as well as gear icon which allows you to tweak what properties to show. I recommend disabling `block`, `page` and `type` as they are essentially useless for us right now.

---

You might find yourself wanting to reorder the table a little. Unfortunately, Logseq doesn’t expose any easy UI to do it, so we need to get our hands dirty and directly edit the page in notepad.exe (or your Disney's Hannah Montana Star Quality Spiral Flip Notepad in the case you have one).

In the top right menu (`...`), you can open the page in the default app or in directory if you have different plans.

Find something similar to this:
```yaml
- {{query (and (property type Book) (not [[Templates]] )) }}
  query-table:: true
  query-properties:: [:title :author :status :started-on :completed-on]
  query-sort-by:: status
  query-sort-desc:: false
```

And I think you already know how to reorder your columns.

# Is that all?

Yeah, for the Logseq. You might want to improve your rizz while you’re doing something with your life (Gregory, I am truly sorry for the Mr. Hippo magnet).

I hope it was a fine read, and you got something useful out of it. In some time I will slowly post more stuff that might interest you, so add this blog to your RSS reader or refresh every 15 minutes (please don’t).

[^1]: https://logseq.com/