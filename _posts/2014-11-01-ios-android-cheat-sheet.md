---
layout: post
title:  "iOS <> Android Vocab Cheat Sheet"
date:   2014-11-01 02:29:53
categories: iOS AndroidDev
---

A couple months ago while at Venmo, [@chrismaddern](https://twitter.com/chrismaddern) and I discussed the lack of a bidirectional dictionary/vocab list of parallel terms in Android and iOS. It's important to know what your teammates are refering when they talk about code, even if you're not engaged with it every day. This is a beginning attempt to finally break down that knowledge gap. The goal is to allow developers of one framework to understand the basics of the other and should someone want to make the switch, this can be a resource in helping learn the new framework.

If there's a topic that you think would be interesting to discuss, [tweet at me](https://twitter.com/rdshapiro) and we'll get include it in this list. I'll be updating this post with links to all future posts.

Disclaimer: I'm an Android developer and have done minimal iOS/Objective-C programming. If there is anything incorrect, reach out and I'll fix it as soon as possible. I'm assuming iOS developer are not, on the whole using Swift yet, so all references will be to Objective-C.

# Part 1: View Controllers
## `UIViewController` vs. `{Activity, Fragment}`
Both frameworks have concepts for a View Controller - a central place for code that bridges the gap between [Views and Models](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller). iOS leads the way here in that `UIViewController`s are composable (a parent VC can contain 1 or more child VCs). `Fragment`s are a closer resemblance to `UIViewController`s, though they cannot live on their own, they must be contained within an `Activity`. Before Android 4.2 (API 17), you could not nest `Fragment`s (though `Fragment`s in the [support library](http://developer.android.com/tools/support-library/index.html) provide backward compatibility). `Activity`s encompass one single screen, but otherwise have a very similar API to `Fragment`s. Often, developers might have an activity that only has one `Fragment` as a forward-thinking API design, should they ever want to include the fragment in a tablet layout alongside another fragment.

### View Loading
iOS:

{% highlight objective-c %}
- loadView
- viewDidLoad
{% endhighlight %}

Android:
{% highlight java %}
void onCreate() // Activities and Fragments
void onCreateView() // just fragments
// note, these both have different argument lists, left out for clarity
{% endhighlight %}

These methods are where the the view is created and configured, respectively. In iOS, if you have a NIB associated to your view controller, `loadView` isn't necessary; if you don't, then you must call

{% highlight objective-c %}
self.view = /* your root view */;
{% endhighlight %}

To set the root view in Android, call
{% highlight java %}
Activity.setContentView()
{% endhighlight %} {: .inlined .connectNext}
or return the view from
{% highlight java %}
Fragment.onCreateView()
{% endhighlight %} {: .inlined .connectNext}
method.

### Presentation
{% highlight objective-c %}
- viewDidAppear
{% endhighlight %} {: .inlined .connectNext }
vs.
{% highlight java %}
void onResume()
{% endhighlight %} {: .inlined }

Callback for when the controller's view is presented or when the user returns to the view from within the app. On Android, this could be called multiple times in the controller's lifecycle if the user leaves and returns to the app, but not on iOS.

### Hiding
{% highlight objective-c %}
- viewWillDisappear
{% endhighlight %} {: .inlined .connectNext }
vs.
{% highlight java %}
void onPause()
{% endhighlight %} {: .inlined }

The inverse of `- viewDidAppear / onPause()`. These are called when the controller is hidden.

In iOS, for a `UIViewController` to receive callbacks for when the app is foregrounded/backgrounded, it can listen to the `UIApplicationDidEnterBackgroundNotification` and `UIApplicationWillEnterForegroundNotification` notifications like so:

{% highlight objective-c %}
NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
[notificationCenter addObserver:self
                       selector:@selector(yourCallbackMethodName:)
                           name:UIApplicationDidEnterBackgroundNotification
                         object:nil];
{% endhighlight %}

Don't forget to unregister when you're done!

{% highlight objective-c %}
- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}
{% endhighlight %}

Thanks to [@dasmersingh](https://twitter.com/dasmersingh) and [@chrismaddern](https://twitter.com/chrismaddern) for some polish on the iOS side of things. [Let me know](https://twitter.com/rdshapiro) if you liked this and I'll continue writing it!