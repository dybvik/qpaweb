from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin
admin.autodiscover()

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^dev/$', TemplateView.as_view(template_name="index.html"), name='index'),
    url(r'^qpaweb/$', TemplateView.as_view(template_name="quiver.html"), name='quiver'),
    url(r'^signup/$', TemplateView.as_view(template_name="signup.html"), name="signup"),
    url(r'^help/$', TemplateView.as_view(template_name="help.html"), name="help"),
    url(r'^about/$', TemplateView.as_view(template_name="about.html"), name="about"),
    # url(r'^$', 'qpaweb.views.home', name='home'),
    # url(r'^qpaweb/', include('qpaweb.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
