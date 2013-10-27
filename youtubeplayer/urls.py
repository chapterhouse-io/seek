from django.conf.urls import patterns, include, url
from django.conf import settings
from django.conf.urls.static import static

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

from django.views.generic.base import RedirectView

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'youtubeplayer.views.home', name='home'),
    # url(r'^youtubeplayer/', include('youtubeplayer.foo.urls')),

    # views
    url(r'^$', 'player.views.index'),

    # api calls
    url(r'^api/get_videos$', 'player.api.get_videos'),
    url(r'^api/add_video$', 'player.api.add_video'),
    url(r'^api/del_video$', 'player.api.del_video'),
    url(r'^api/star_video$', 'player.api.star_video'),
    url(r'^api/get_timestamps$', 'player.api.get_timestamps'),
    url(r'^api/set_timestamps$', 'player.api.set_timestamps'),

    # account calls
    url(r'^account/log_in', 'account.views.log_in'),
    url(r'^account/log_out', 'account.views.log_out'),
    url(r'^account/register', 'account.views.register'),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),

    # favicon
    # TODO - move to CDN
    url(r'^favicon\.ico$', RedirectView.as_view(url='/static/favicon.ico')),
)

# for Heroku to serve via Gunicorn
# TODO - move static content to CDN
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns += staticfiles_urlpatterns()