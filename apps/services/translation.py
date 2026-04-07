from modeltranslation.translator import register, TranslationOptions
from .models import ServiceType


@register(ServiceType)
class ServiceTypeTranslationOptions(TranslationOptions):
    fields = ("name", "description")