from django.conf.urls import patterns, include, url
from django.view.generic import TemplateView

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^helloworld$', TemplateView.as_view(template_name="test.html")),
    # url(r'^$', 'qpaweb.views.home', name='home'),
    # url(r'^qpaweb/', include('qpaweb.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
