using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using PID.Domain.Repositories.Definitions;
using PID.Infra.Context;

namespace PID.Infra.Repositories.Definitions;

public abstract class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : class
{
    protected readonly PIDContext _pIDContext;

    protected DbSet<TEntity> SetEntity() => _pIDContext.Set<TEntity>();

    public RepositoryBase(PIDContext pIDContext)
    {
        _pIDContext = pIDContext;
    }

    public async Task<TEntity?> GetByIdAsync(Guid id) => await SetEntity().FindAsync(id);
    public IEnumerable<TEntity> GetAll() => SetEntity().AsEnumerable();
    public IEnumerable<TEntity> Find(Expression<Func<TEntity, bool>> expression) => SetEntity().Where(expression);
    public bool Exists(Expression<Func<TEntity, bool>> expression) => SetEntity().Any(expression);
    public void Add(TEntity entity) => SetEntity().Add(entity);
    public void AddRange(IEnumerable<TEntity> entities) => SetEntity().AddRange(entities);
    public void Update(TEntity entity) => SetEntity().Update(entity);
    public void UpdateRange(IEnumerable<TEntity> entities) => SetEntity().UpdateRange(entities);
    public void Remove(TEntity entity) => SetEntity().Remove(entity);
    public void RemoveRange(IEnumerable<TEntity> entities) => SetEntity().RemoveRange(entities);
    public int SaveChanges() => _pIDContext.SaveChanges();
    public async Task<int> SaveChangesAsync() => await _pIDContext.SaveChangesAsync();
}