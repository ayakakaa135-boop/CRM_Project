from django_filters import rest_framework as filters
from .models import Company


class CompanyFilter(filters.FilterSet):
    name   = filters.CharFilter(lookup_expr="icontains")
    status = filters.ChoiceFilter(choices=Company.Status.choices)

    class Meta:
        model  = Company
        fields = ["name", "status", "cr_number"]