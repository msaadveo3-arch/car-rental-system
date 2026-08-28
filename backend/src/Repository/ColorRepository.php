<?php

namespace App\Repository;

use App\Entity\Color;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

final class ColorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry) { parent::__construct($registry, Color::class); }

    public function queryAll(string $alias = 'entity'): QueryBuilder
    {
        return $this->createQueryBuilder($alias)->orderBy($alias.'.id', 'ASC');
    }

    public function queryActive(string $alias = 'entity'): QueryBuilder
    {
        return $this->queryAll($alias)->andWhere($alias.'.status = :status')->setParameter('status', 'active');
    }
}
