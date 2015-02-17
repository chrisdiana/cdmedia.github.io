---
layout: page
title: Archive
---

## Blog Posts
or [search by tag]({{ url }}/tags)

<ul class="archive-list">
{% for post in site.posts %}
  <li><span>{{ post.date | date_to_string }}</span><a href="{{post.url}}">{{post.title }}</a></li>
{% endfor %}
</ul>
