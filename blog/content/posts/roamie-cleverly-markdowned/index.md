---
title: "Roamie, Cleverly Markdowned"
date: 2023-08-05T20:24:15+02:00

tags:
  - Projects
  - Programming
  - Roamie
---

So, I’ve been working on something for the last few days, nothing big really, but I think it might become useful in the future…

You probably know what Logseq and Obsidian are, and even if you don’t then it’s one search away. In short, a great software for creating your own digital brain. Storing notes, information etc. without much of a hassle.

---

I really like both these solutions as they make my life really easy (well, I am using Logseq mainly, and I just explored Obsidian from the curiosity). All my notes, plans, routines are composed in these tools. The concept of digital brain in itself is beautiful, but the lack of standardization doesn’t help much.

The effects are pretty obvious:
  - One app compatible with only one layout of files
  - The tools are flaky, and don’t respond quickly to the changes in the file format specific to each tool
  - As these formats are based on Markdown, they should be easily renderable by other tools, but finally we get a big mess which is unreadable
  - External integrations are pain
  - Major lockdown, even if the tool is open in itself

This also makes extending the format pretty impossible, unless you are strictly within the limits of the current format. The usual lack of end-to-end encryption is pretty concerning too, as Logseq and Obsidian only allow it with their own synchronization servers rather than locally.

## What I’ve done?

I’ll face myself
To cross what I’ve become
Erase myself
And show what I’ve done.

Because I have really done something about it… or I am *doing* right now. My efforts are all coming to one simple solution which is both open, renderable AND human-readable. Actually, the solution is so simple that I wonder why someone didn’t do it before. Nonetheless, here it is.

```md
[](Title 'Index')
[](Modified '2023-08-04 23:55:43')

- [Roamie Specification](./specification/roamie.md)
  [](Some-Random 'Metadata')
  [](Much-More 'Random AAAA')
  [](And-So 'On')
  [](Name 'some-random-block')
- [This is a fallback which should contain useful info](./examples/block-reference.md 'simple-block')
```

---

I’ve found that, rightfully, `[](link title)` syntax is parsed, and rendered, but invisible in the final product.

{{< figure
    src="image2.png"
    alt="rendered markdown"
    caption="rendered by PanDoc"
>}}

There is nothing! (Some renderers might want to add new lines etc. but it can be easily modified.)

{{< figure
    src="image1.png"
    alt="rendered markdown"
    caption="rendered by GitHub"
>}}

So simple, yet effective. You can add infinite amounts of metadata to each block and page, which are standard CommonMark files. It just all comes down to how the tools handles the generation, which shouldn’t be too hard to tweak right.

---

It is still a pretty young idea, which I am working still working on. The code will be public on GitHub. The basic implementation in Solid.js for fast editing of the graphs via browser. The simplicity of adding new metadata and extensions for the format via these cursed links also means that new features should come out quick, while being pretty polished format-wise.

## Final words

The future will show us how it will turn out. My hope is to make some changes in the current tides, and move format the current market of really just two tools that are commonly used. Also, this is a great solution for in code documentation via Markdown. (Think Confluence, but self-hosted, and without any Atlassian jankiness).
