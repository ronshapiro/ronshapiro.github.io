---
layout: post
title: "Java 8 + Android Spike"
---

After getting excited about the many awesome new features in Java 8, I was trying to think of a way to backport them to Java 6 so that they could be run on Android's Dalvik VM. The [gradle-retrolambda](https://github.com/evant/gradle-retrolambda) plugin is very helpful, but that only translates lambdas back to Java 6. Any new APIs, like [Streams](http://download.java.net/jdk8/docs/api/java/util/stream/package-summary.html) aren't installed on Android phones, so those won't compile against an android.jar. I wanted to see if it was possible to get these APIs on Android, so I went exploring.

I began by downloading the full jdk8 repo with `hg clone http://hg.openjdk.java.net/jdk8/jdk8`. I copied most of the source files into a git repo and used a combination of `git grep` and `sed` to attempt to repackage every class under a `j86` root package. I moved this into an Android Studio project but saw lots of errors when compiling.
- Somehow, certain classes, like `java.io.FileDescriptor` weren't included in my clone, and therefore not in the `j86` package.
- I noticed that any classes within `java.lang.*` were automatically imported, but this wasn't the case for the `j86` package.
- Some entire packages seemed to be missing components. These were generally packages like AWT and Swing, so deleting the entire package should be fine since they're not necessary on Android.

I also realized that all of these classes would have to be "isolated"; a `j86.java.util.List` (with `Stream`s) would not be usable in an Android API that required a regular `java.util.List`. there might be some reconciliation between these two, but that would require *lots* of manual editing.
Additionally, including all of these files would balloon the APK size well over 100mb. Using ProGuard you could surely trim this down, but even for debug builds this isn't ideal.

Later I'll try to see if there are particular units of code that can be included on their own (for example, the new Collections APIs) that will also play nicely with gradle-retrolambda. Until then, feel free to [clone/fork my progress](https://github.com/ronshapiro/j86) from Github.