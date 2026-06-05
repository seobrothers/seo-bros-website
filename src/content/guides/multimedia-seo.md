---
title: "Multimedia SEO: Why Your Content Should Live in Five Formats"
category: seo
publishDate: 2021-08-19
author: "Devon Bate"
summary: SEO stopped being a text-only sport a few years ago, and 2021 is the year that became impossible to ignore. The interesting question is no longer whether to produce multimedia. It's how to ship one piece of source content across five formats without quintupling the workload.
featured: false
---

For most of Google's history, SEO meant publishing the best text page and earning links to it. Text was the format. Everything else was an accessory.

That hasn't been true for a while. In 2021 it stopped being even partially true.

Google's results page now reserves real estate for video carousels, image packs, podcast results, news cards, knowledge panels, and social box-outs. A pure-text page competes for a shrinking percentage of pixels on the screen. The interesting question for SEO operators is no longer whether to make video. It's how to produce one piece of source content and ship it across five formats without quintupling the workload.

## One piece of content, five SERP surfaces

![Diagram showing one researched topic on the left fanning out to five outputs on the right: a long-form blog post for the organic listing, a long-form YouTube video for the video carousel and YouTube search, a vertical short for TikTok, Reels, and YouTube Shorts, a podcast episode for Google Podcasts, Spotify, and Apple, and a set of images and audiograms for image search and social distribution.](/images/guides/multimedia-seo/repurposing-fan-out.svg)

The right unit of work is no longer a blog post. It's a topic.

A single researched topic can become a long-form blog post, a long-form YouTube video, a vertical cut for TikTok and Reels and Shorts, a podcast episode, and a set of images and audiogram clips. Each one occupies different SERP real estate. Each one reaches a slightly different audience. The blog post wins the organic listing. The long-form video wins the video carousel and lives in YouTube search. The vertical short wins discovery on platforms where the audience already is. The podcast wins the podcast result. The images win image search and share well everywhere.

The leverage isn't free. Each format takes some additional work. But the marginal cost of producing a vertical cut from a horizontal video, or an audiogram from a podcast clip, has dropped to nearly nothing this year. Tools below.

## What changed

Short-form video crossed an inflection point in 2021.

YouTube Shorts launched globally on July 12, after almost a year of beta-by-country rollout. Instagram Reels passed its first anniversary in August. TikTok was approaching a billion monthly users. Each of those platforms has a discovery algorithm that is fundamentally more generous to new accounts than Google's algorithm has been in years. A vertical short with no audience can hit a million views on day one. A blog post with no audience cannot.

Meanwhile Google has been quietly making its SERPs more multimedia. Video carousels appear for queries that used to be text-only. Podcast results have been promoted further up the page since the indexing rollout in 2019. The June 2021 Page Experience update made multimedia performance, including Core Web Vitals, a ranking signal in itself.

The strategic implication is straightforward. The marginal SEO value of the seventh paragraph on your blog post is now roughly zero. The marginal SEO value of a vertical short cut from your supporting video, ranking on YouTube Shorts and surfacing in the YouTube carousel on Google, is not zero.

## The tools

Three to five years ago, repurposing across formats was the job of an in-house video editor, a podcast producer, and a designer. In 2021 you can do most of it with a small stack of software tools.

<!-- TODO: wrap "Kamua" below in a real anchor once the domain has been acquired -->
<span style="color: var(--teal-dark); text-decoration: underline; text-underline-offset: 3px;">Kamua</span> is the most ruthless example of what AI can take off the editing table. Their AutoCrop tool takes a horizontal video and produces a vertical cut, using computer vision to track the subject so the framing stays correct as the speaker moves. AutoCaption produces subtitles in over sixty languages. AutoCut splits a recording into component shots. The whole pipeline runs in the browser on GPU infrastructure, which means a long video that would take a desktop editor twenty minutes to render is done in two.

[Descript](https://www.descript.com/) is the closest thing the audio and video editing world has to a single-tool studio. It transcribes a recording, lets you edit the audio or video by editing the transcript text, and applies the cuts to the underlying media. For podcast and talking-head video work it has effectively replaced the linear timeline editor for most operators we run into.

[Veed.io](https://www.veed.io/) sits in the same space as Kamua and Descript but skews toward simple browser-based editing with subtitles, brand kits, and templates. Lower ceiling, lower learning curve. Good for teams that need to ship a lot of short cuts quickly without training people on a heavier tool.

[Riverside.fm](https://riverside.fm/) is the recording end of the podcast and interview pipeline. It records each participant's audio and video locally at full quality, then uploads the files separately, so a remote interview ends up with broadcast-grade source material rather than the compressed mess most video calls produce. That source material is what makes downstream repurposing actually viable. Garbage in, garbage out is a real constraint on this whole workflow.

[Otter.ai](https://otter.ai/) is the transcription utility under everything else. It turns recorded audio into searchable, editable text, which is what makes the blog-post-from-the-podcast and captions-on-the-short workflows possible. It also handles real-time meeting transcription if that's relevant to your operation.

[Headliner](https://www.headliner.app/) is the audiogram tool. Take a clip of audio, generate a video with a waveform animation and captions overlaid on a still image, post to social. It is unglamorous but it solves a specific problem, giving an audio asset somewhere visual to live, that no general-purpose video tool handles cleanly.

## Making any of this actually indexable

Producing the multimedia is half the job. Making it findable is the other half.

<iframe style="width:100%; aspect-ratio: 16/9; border: 0; border-radius: 12px; margin: 32px 0;" src="https://www.youtube.com/embed/1Zqkz8Y_kFw" title="Video best practices for Google Search and Discover | Search Central Lightning Talks" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>

Danielle Marshak's March 2021 Lightning Talk on the Google Search Central channel is the canonical reference for the rest of this section. Five-minute version of what follows.

Add VideoObject schema to your blog post and to the YouTube video's host page. Video carousels in SERPs draw from this markup. If Google cannot parse what your video is about, the long-form video will not compete for the carousel slot.

Publish full transcripts of every podcast episode and long-form video on your site. Transcripts make audio and video content crawlable, give you long-tail keyword coverage, and double as the source for blog post versions of the same material.

Use timestamps in YouTube descriptions for any video over five minutes. Google now shows "key moments" cards in YouTube results that come directly from timestamped chapters. Two minutes of extra work, real SERP real estate gain.

Alt text and Open Graph metadata on every image and audiogram. Image search is small compared to web search, but it compounds. A thousand alt-tagged images across a site accumulate into a meaningful traffic source.

## What most operators are still missing

The SEO industry is still treating multimedia as an optional enhancement to text-first content. Most agencies offer "blog content" as a line item and treat video as a separate, more expensive service. Most clients have a content calendar that maps cleanly onto blog posts and barely accommodates anything else.

That is the wrong shape. The shape that wins the next three years of search is a content workflow where one researched topic produces five outputs, and the SEO operator is responsible for all five. The tools listed above make this economically feasible in a way it was not even two years ago. The strategic shift is the part that is still catching up.

## How we approach this at SEO Brothers

We are a technology-first SEO company offering [white label seo](/white-label-seo/) to agencies and growth-focused operators. That means we are paying close attention to where the SERP is going, not just where it has been. Multimedia is the most underweighted area we see in client content calendars, and the operators who fix it now are the ones who will have a substantial real-estate advantage by 2024.

If you want help mapping out a multimedia workflow for your traffic, [get a free audit](/#book-audit) and we will walk you through what we are seeing.
