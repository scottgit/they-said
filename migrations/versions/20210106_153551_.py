"""empty message

Revision ID: 3821b75f08f2
Revises: 
Create Date: 2021-01-06 15:35:51.533467

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3821b75f08f2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('claims',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('assertion', sa.String(length=200), nullable=False),
    sa.Column('notes', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('assertion')
    )
    op.create_table('hit_keys',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('key', sa.String(length=30), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('key')
    )
    op.create_table('texts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('word_count', sa.Integer(), nullable=False),
    sa.Column('source', sa.String(length=500), nullable=True),
    sa.Column('locked', sa.Boolean(), nullable=False),
    sa.Column('added_by', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('first_name', sa.String(length=40), nullable=False),
    sa.Column('last_name', sa.String(length=40), nullable=False),
    sa.Column('verified', sa.Boolean(), nullable=False),
    sa.Column('deleted', sa.Boolean(), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('updated_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('claim_histories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('updated_by', sa.Integer(), nullable=False),
    sa.Column('claim_id', sa.Integer(), nullable=False),
    sa.Column('assertion', sa.String(length=30), nullable=False),
    sa.Column('notes', sa.Text(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['claim_id'], ['claims.id'], ),
    sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('claim_hit_keys',
    sa.Column('claim_id', sa.Integer(), nullable=True),
    sa.Column('key_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['claim_id'], ['claims.id'], ),
    sa.ForeignKeyConstraint(['key_id'], ['hit_keys.id'], )
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('claim_hit_keys')
    op.drop_table('claim_histories')
    op.drop_table('users')
    op.drop_table('texts')
    op.drop_table('hit_keys')
    op.drop_table('claims')
    # ### end Alembic commands ###