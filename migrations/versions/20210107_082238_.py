"""empty message

Revision ID: a6ed9e42c293
Revises: 
Create Date: 2021-01-07 08:22:38.777831

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a6ed9e42c293'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('arguments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('statement', sa.String(length=250), nullable=False),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('statement')
    )
    op.create_table('claims',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('assertion', sa.String(length=200), nullable=False),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('assertion')
    )
    op.create_table('hit_keys',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('key', sa.String(length=30), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('key')
    )
    op.create_table('texts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('word_count', sa.Integer(), nullable=False),
    sa.Column('source', sa.String(length=500), nullable=True),
    sa.Column('locked', sa.Boolean(), nullable=False),
    sa.Column('locked_at', sa.DateTime(), nullable=False),
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
    op.create_table('change_histories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('updated_by', sa.Integer(), nullable=False),
    sa.Column('changed_at', sa.DateTime(), nullable=False),
    sa.Column('table_name', sa.Enum('CLAIMS', 'HITS', 'RATINGS', 'HIT_KEYS', 'SUPPORT_REBUTS', 'ARGUMENTS', name='tracked_tables'), nullable=False),
    sa.Column('table_pk', sa.Integer(), nullable=False),
    sa.Column('old_data', sa.JSON(), nullable=False),
    sa.Column('new_data', sa.JSON(), nullable=False),
    sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('claim_hit_keys',
    sa.Column('claim_id', sa.Integer(), nullable=False),
    sa.Column('key_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['claim_id'], ['claims.id'], ),
    sa.ForeignKeyConstraint(['key_id'], ['hit_keys.id'], ),
    sa.PrimaryKeyConstraint('claim_id', 'key_id')
    )
    op.create_table('hits',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('text_id', sa.Integer(), nullable=False),
    sa.Column('key_id', sa.Integer(), nullable=True),
    sa.Column('claim_id', sa.Integer(), nullable=False),
    sa.Column('location', sa.Integer(), nullable=False),
    sa.Column('word_count', sa.Integer(), nullable=False),
    sa.Column('custom_key', sa.String(length=500), nullable=True),
    sa.Column('grouped_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['claim_id'], ['claims.id'], ),
    sa.ForeignKeyConstraint(['grouped_id'], ['hits.id'], ),
    sa.ForeignKeyConstraint(['key_id'], ['hit_keys.id'], ),
    sa.ForeignKeyConstraint(['text_id'], ['texts.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('supports_rebuts',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('claim_id', sa.Integer(), nullable=False),
    sa.Column('argument_id', sa.Integer(), nullable=False),
    sa.Column('supports', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['argument_id'], ['arguments.id'], ),
    sa.ForeignKeyConstraint(['claim_id'], ['claims.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('ratings',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('created_by', sa.Integer(), nullable=True),
    sa.Column('hit_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['hit_id'], ['hits.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('ratings')
    op.drop_table('supports_rebuts')
    op.drop_table('hits')
    op.drop_table('claim_hit_keys')
    op.drop_table('change_histories')
    op.drop_table('users')
    op.drop_table('texts')
    op.drop_table('hit_keys')
    op.drop_table('claims')
    op.drop_table('arguments')
    # ### end Alembic commands ###