﻿using Microsoft.AspNet.Identity.EntityFramework;
using System.Data.Entity;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Data.Common;

namespace Web.Models
{
  public interface IAppDbContext
  {
    IDbSet<User> Users { get; set; }
    DbSet<Post> Posts { get; set; }
    DbSet<Order> Orders { get; set; }
    DbSet<OrderItem> OrderItems { get; set; }
    DbSet<Product> Products { get; set; }

    void MarkAsModified(object item);
    int SaveChanges();
    Task<int> SaveChangesAsync();
  }

  public class AppDbContext : IdentityDbContext<User>, IAppDbContext
  { 
    public AppDbContext()
      : base("name=DefaultConnection", throwIfV1Schema: false)
    {
      Database.SetInitializer(new CreateDatabaseIfNotExists<AppDbContext>());
    }

    //Effort in memory db
    public AppDbContext(DbConnection connection) : base(connection, contextOwnsConnection: true)
    {
    }

    public DbSet<Post> Posts { get; set; }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Product> Products { get; set; }

    public static AppDbContext Create()
    {
      return new AppDbContext();
    }

    public void MarkAsModified(object item)
    {
      Entry(item).State = EntityState.Modified;
    }

    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
      modelBuilder.Entity<Order>().Property(x => x.Amount).HasPrecision(18, 6);

      base.OnModelCreating(modelBuilder);
    }

    public override int SaveChanges()
    {
      DateTime saveTime = DateTime.Now;
      foreach (var entry in this.ChangeTracker.Entries().Where(e => e.State == EntityState.Added))
      {
        if (typeof(IEntity) == entry.GetType())
        {
          var e = ((IEntity) entry.Entity);
          if (e.CreateDate == null)
            e.CreateDate = saveTime;
        }
      }
      return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync()
    {
      DateTime saveTime = DateTime.Now;
      foreach (var entry in this.ChangeTracker.Entries().Where(e => e.State == EntityState.Added))
      {
        if (typeof(IEntity) == entry.GetType())
        {
          var e = ((IEntity) entry.Entity);
          if (e.CreateDate == null)
            e.CreateDate = saveTime;
        }
      }
      return base.SaveChangesAsync();
    }
  }
}