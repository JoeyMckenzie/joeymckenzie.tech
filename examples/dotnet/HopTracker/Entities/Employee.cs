using System.Diagnostics.CodeAnalysis;

namespace HopTracker.Entities;

public class Employee : EntityClassBase
{
    public required string FirstName { get; init; }

    public required string LastName { get; init; }

    public required int BreweryId { get; init; }
}

public class EmployeeComparer : IEqualityComparer<Employee>
{
    public bool Equals(Employee? x, Employee? y)
    {
        if (x is null && y is null)
        {
            return false;
        }

        if (x is null && y is not null)
        {
            return false;
        }

        if (y is null && x is not null)
        {
            return false;
        }

        var firstNamesAreEqual = string.Equals(
            x!.FirstName,
            y!.FirstName,
            StringComparison.CurrentCultureIgnoreCase
        );
        var lastNamesAreEqual = string.Equals(
            x.FirstName,
            y.FirstName,
            StringComparison.CurrentCultureIgnoreCase
        );

        return firstNamesAreEqual && lastNamesAreEqual;
    }

    public int GetHashCode([DisallowNull] Employee employee)
    {
        return HashCode.Combine(
            employee.Id,
            employee.FirstName,
            employee.LastName,
            employee.CreatedAt,
            employee.UpdatedAt,
            employee.BreweryId
        );
    }
}
